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
import { AliasModel } from "../db/AliasModel";
import { Alias } from "../models/Alias";
import { parseError } from "../utils/mongoose";

const ALIAS_MAX_LEN = Number.parseInt(process.env.ALIAS_MAX_LEN || '');
if (isNaN(ALIAS_MAX_LEN)) throw new Error('ALIAS_MAX_LEN is not set');

type CreateAliasBody = Pick<Alias, 'url'>;
type CreateAliasResponse = Pick<Alias, 'url' | 'alias'>;

@Route("alias")
export class AliasController extends Controller {
    @Get("{alias}")
    public async getUrk(
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

    @SuccessResponse("200", "Created")
    @Post()
    public async createAlias(
        @Body() requestBody: CreateAliasBody
    ): Promise<CreateAliasResponse> {
        try {
            const { url } = requestBody;

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
