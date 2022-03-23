import request from "supertest";
import assert from "assert";
import mongoose from "mongoose";
import { app } from "../src/app";
import { Alias } from "../src/db/AliasModel";

describe('API test', () => {
    after(async () => {
        await Alias.deleteMany({});
        await mongoose.disconnect();
    })
    
    it('should store a long url an alias that can be used to retrieve the original url', async function () {
        this.timeout(10000);

        const url = 'http://long-john-browner/kitkats/the-red-one';
        let response = await request(app)
            .post('/store')
            .send({ url })
            .expect(200);

        assert.notEqual(response.body.alias, undefined);

        response = await request(app)
            .get('/read')
            .query({ alias: response.body.alias })
            .expect(200);

        assert.equal(response.body.url, url);
    });
});
