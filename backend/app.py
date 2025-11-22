from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io

app = FastAPI(title="CatDog API", version="0.2.0")

# 允许本地前端跨域（开发阶段用“*”，上线时请改成你的前端域名）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictResponse(BaseModel):
    label: str
    confidence: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    # 1) 基础校验：MIME 类型
    if file.content_type is None or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="请上传图片文件")

    # 2) 读取与解析图片，确认能被 Pillow 打开
    content = await file.read()
    try:
        _img = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="无法解析图片，请更换文件")

    # 3) 占位推理逻辑（后面会替换为真实模型推理）
    name = (file.filename or "").lower()
    if "cat" in name:
        return PredictResponse(label="cat", confidence=0.88)
    elif "dog" in name:
        return PredictResponse(label="dog", confidence=0.89)
    else:
        # 如果文件名里没线索，就固定返回一个占位结果
        return PredictResponse(label="cat", confidence=0.55)