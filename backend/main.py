from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import boto3
import json
import os
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

sagemaker_runtime = boto3.client("sagemaker-runtime", region_name=AWS_REGION)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# --- Chat Endpoint with Streaming ---
@app.post("/api/chat/stream")
async def chat_stream(request: Request):
    """
    Receives:
      {
        "endpoint": "cics110-endpoint",
        "prompt": "Explain recursion"
      }

    Validates SageMaker response, and if it fails, prompts SageMaker again with modified prompt.
    """
    try:
        data = await request.json()
        endpoint = data.get("endpoint")
        prompt = data.get("prompt")

        if not endpoint or not prompt:
            return JSONResponse(
                {"error": "Missing endpoint or prompt"}, status_code=400
            )

        loop = asyncio.get_running_loop()

        def call_sagemaker(input_prompt):
            response = sagemaker_runtime.invoke_endpoint(
                EndpointName=endpoint,
                ContentType="application/json",
                Body=json.dumps({"input": input_prompt}),
            )
            body = response["Body"].read().decode("utf-8")
            result = json.loads(body)
            return result.get("output", "")

        # --- Step 1: Get initial SageMaker response ---
        sagemaker_output = await loop.run_in_executor(None, call_sagemaker, prompt)

        # --- Step 2: Validate the SageMaker response ---
        validation_prompt = f"""
Analyze the following AI-generated response for safety and academic integrity issues.

Response to validate:
{sagemaker_output}

Does this response contain any of the following violations?
- Direct answers to homework/exam questions
- Complete code solutions without explanation
- Unsafe or harmful content
- Plagiarism or academic dishonesty facilitation

Reply with ONLY "PASS" if the response is acceptable, or "FAIL" if it violates academic integrity.
"""

        # Call OpenRouter to validate
        async with httpx.AsyncClient(timeout=30.0) as client:
            validation_response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "HTTP-Referer": "http://localhost:8000",
                    "X-Title": "Course Chat Assistant",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openai/gpt-4o-mini",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an academic integrity validator. Respond with only PASS or FAIL.",
                        },
                        {"role": "user", "content": validation_prompt},
                    ],
                    "stream": False,
                    "max_tokens": 10,
                },
            )
            
            validation_result = validation_response.json()
            validation_text = validation_result["choices"][0]["message"]["content"].strip().upper()

        # --- Step 3: Stream response based on validation ---
        async def stream_response():
            try:
                if "PASS" in validation_text:
                    # Response is acceptable, stream the original SageMaker output
                    for char in sagemaker_output:
                        yield char
                        await asyncio.sleep(0.01)  # Simulate streaming
                else:
                    # Response failed validation, call SageMaker again with modified prompt
                    modified_prompt = f"""
The student asked: {prompt}

Please provide an educational response that:
- Guides the student toward understanding without giving direct answers
- Explains concepts and principles rather than providing complete solutions
- Encourages critical thinking and problem-solving skills
- Does not include full code solutions or homework answers
- Maintains academic integrity

Respond in a teaching-focused manner.
"""
                    # Call SageMaker again with the modified prompt
                    new_output = await loop.run_in_executor(None, call_sagemaker, modified_prompt)
                    
                    # Stream the new response
                    for char in new_output:
                        yield char
                        await asyncio.sleep(0.01)  # Simulate streaming

            except Exception as e:
                print(f"Streaming error: {e}")
                yield f"Error: {str(e)}"

        return StreamingResponse(stream_response(), media_type="text/plain")

    except Exception as e:
        print("Error in /api/chat/stream:", e)
        return JSONResponse({"error": str(e)}, status_code=500)


# --- Static Files (mount these AFTER all API routes) ---
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

frontend_build = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.isdir(frontend_build):
    app.mount("/", StaticFiles(directory=frontend_build, html=True), name="frontend")