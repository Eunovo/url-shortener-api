import request from "supertest";
import assert from "assert";
import mongoose from "mongoose";
import { app } from "../src/app";
import { AliasModel } from "../src/db/AliasModel";

describe('API test', () => {
    after(async () => {
        await AliasModel.deleteMany({});
        await mongoose.disconnect();
    })

    it('should store a new url an alias that can be used to retrieve the original url', async function () {
        const urls = [
            'http://long-john-browner/kitkats/the-red-one',
            'http://long-john-browner/kitkats/the-blue-one'
        ];

        // Should be able to store and retrieve urls
        for (const url of urls) {
            let response = await request(app)
                .post('/alias')
                .send({ url })
                .expect(200);

            assert.notEqual(response.body.alias, undefined);

            response = await request(app)
                .get(`/alias/${response.body.alias}`)
                .expect(200);

            assert.equal(response.body.url, url);
        }

        // Should reject duplicate URLs
        for (const url of urls) {
            await request(app)
                .post('/alias')
                .send({ url })
                .expect(422);
        }
    });
});
