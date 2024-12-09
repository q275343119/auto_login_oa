from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict

from fastapi import FastAPI
import uvicorn
from collections import defaultdict

from fastapi.middleware.cors import CORSMiddleware

from ocr_server import identification_verification_code

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # 允许所有来源的跨域请求，你也可以设置为具体的域名来限制请求来源
    allow_origins=["*"],
    # 参数设置为True表示允许携带身份凭证，如cookies
    allow_credentials=True,
    # 表示允许所有HTTP方法的请求
    allow_methods=["*"],
    # 表示允许所有请求头
    allow_headers=["*"]
)


@dataclass
class Code:
    code: str
    dt: datetime


CODE_DICT = defaultdict(defaultdict)


@app.get("/set/code")
async def set_code(phone: str, project_name: str, code: str):
    """
    记录验证码
    :param phone:
    :param project_name:
    :param code:
    :return:
    """
    now = datetime.now()
    CODE_DICT[phone][project_name] = Code(code, now)


@app.get("/get/code")
async def get_code(phone: str, project_name: str):
    """
    获取验证码
    :param phone:
    :param project_name:
    :return:
    """
    code_obj = CODE_DICT[phone].get(project_name, None)
    if code_obj:
        now = datetime.now()
        if now > code_obj.dt + timedelta(minutes=1):
            return None
        return code_obj.code
    return None


@app.get("/verify/code")
async def verification_code(bs64: str):
    """
    获取验证码
    :param bs64:
    :return:
    """
    return identification_verification_code(bs64)


if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
