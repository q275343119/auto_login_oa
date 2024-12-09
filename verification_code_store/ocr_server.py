# -*- coding: utf-8 -*-
# @Date     : 2024/12/9 9:17
# @Author   : q275343119
# @File     : ocr_server.py
# @Description:
import base64

import ddddocr

ocr = ddddocr.DdddOcr(show_ad=False)


def identification_verification_code(bs64: str):
    """
    传入base64输出验证码
    :param bs64:
    :return:
    """
    return ocr.classification(base64.b64decode(bs64))
