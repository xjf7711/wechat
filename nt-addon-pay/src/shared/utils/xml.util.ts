import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

/**
 * XML 工具
 */
@Injectable()
export class XmlUtil {
    /**
     * 将对象转换为xml
     *
     * @param obj 对象
     */
    convertObjToXml(obj: {}) {
        return new xml2js.Builder({ rootName: 'xml', cdata: true }).buildObject(obj);
    }

    /**
     * 将xml文本解析为对象
     *
     * @param xml xml文本
     */
    async parseObjFromXml<T>(xml: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            xml2js.parseString(xml, { explicitRoot: false, explicitArray: false }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
}