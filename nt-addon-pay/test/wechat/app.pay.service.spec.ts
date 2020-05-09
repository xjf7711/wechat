import { Test } from '@nestjs/testing';
import * as fs from 'fs';

import { PayAddon, WeChatAppPayService, WeChatTradeType } from '../../src';

describe('WeChatPayAppService', () => {
    let wechatAppPayService: WeChatAppPayService;

    beforeAll(async () => {
        const testModule = await Test.createTestingModule({
            imports: [PayAddon.forRoot({
                wechatConfig: {
                    appid: 'appid',
                    mch_id: 'mch_id',
                    secretKey: 'secretKey',
                    pfx: fs.readFileSync('path_to_p12_file'),
                    sandbox: true
                }
            })]
        }).compile();
        await testModule.init();
        wechatAppPayService = testModule.get<WeChatAppPayService>(WeChatAppPayService);
    });

    describe('pay', () => {
        it('should return success', async () => {
            const res = await wechatAppPayService.pay({
                body: '测试APP支付',
                out_trade_no: '201811011926123',
                total_fee: 301,
                spbill_create_ip: '127.0.0.1',
                notify_url: '127.0.0.1',
                trade_type: WeChatTradeType.APP
            });
            expect(res.result_code).toBe('SUCCESS');
        });

        it('should return fail', async () => {
            const res = await wechatAppPayService.pay({
                body: '测试APP支付',
                out_trade_no: '201811011926123',
                total_fee: 0.1,
                spbill_create_ip: '127.0.0.1',
                notify_url: '127.0.0.1',
                trade_type: WeChatTradeType.APP
            });
            expect(res.return_code).toBe('FAIL');
        });
    });

    describe('queryOrder', () => {
        it('should return success', async () => {
            const res = await wechatAppPayService.queryOrder({
                out_trade_no: '201811011926123'
            });
            expect(res.result_code).toBe('SUCCESS');
        });

        it('should return fail', async () => {
            const res = await wechatAppPayService.queryOrder({
                out_trade_no: '201811011926124'
            });
            expect(res.result_code).toBe('FAIL');
        });
    });

    describe('closeOrder', () => {
        it('should return success', async () => {
            const res = await wechatAppPayService.closeOrder({
                out_trade_no: '201811011926123'
            });
            expect(res.return_code).toBe('SUCCESS');
        });
    });

    describe('refund', () => {
        it('should return success', async () => {
            const res = await wechatAppPayService.refund({
                out_trade_no: '201811011926123',
                out_refund_no: '201811011926123refund',
                total_fee: 301,
                refund_fee: 1
            });
            expect(res.result_code).toBe('SUCCESS');
        });
    });
});