import { nanoid } from "nanoid/async";
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Res,
    Route,
    SuccessResponse,
    TsoaResponse,
    ValidateError,
} from "tsoa";
import { isWebUri } from "valid-url";
import { AliasModel } from "../db/AliasModel";
import { Alias } from "../models/Alias";
import { parseError } from "../utils/mongoose";
import { CreateAliasRequest, CreateAliasResponse } from "./types";

const ALIAS_MAX_LEN = Number.parseInt(process.env.ALIAS_MAX_LEN || '');
if (isNaN(ALIAS_MAX_LEN)) throw new Error('ALIAS_MAX_LEN is not set');

@Route("alias")
export class AliasController extends Controller {

    /**
     * Retrieve the url for the given alias
     * @param alias 
     * @param notFoundResponse 
     * @returns 
     */
    @Get("{alias}")
    public async getUrl(
        @Path() alias: string,
        @Res() notFoundResponse: TsoaResponse<404, { reason: string }>
    ): Promise<Alias> {
        const result = await AliasModel.findOne({ alias });

        if (!result) {
            return notFoundResponse(404, { reason: "That alias does not exist!" });
        }

        this.setStatus(200);
        return result;
    }

    /**
     * Saves the url and returns an alias for it
     * @param body.url must be a valid web url
     * @returns 
     */
    @SuccessResponse("200", "Created")
    @Post()
    public async createAlias(
        @Body() body: CreateAliasRequest
    ): Promise<CreateAliasResponse> {
        try {
            const { url } = body

            if (!isWebUri(url))
                throw new ValidateError(
                    { url: { message: 'Invalid url', value: url } },
                    "Bad Input"
                );

            const alias = await nanoid(ALIAS_MAX_LEN);
            const model = new AliasModel({ url, alias });
            await model.save();

            this.setStatus(200);
            return { url, alias };
        } catch (error: any) {
            throw new ValidateError(parseError(error), 'Bad Input');
        }
    }
}
