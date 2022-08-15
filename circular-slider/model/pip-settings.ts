import {IsBoolean, IsDefined, IsMultipleOf, IsNumber, IsPositive} from "@miniskylab/antimatter-class-validator";
import {IsOptional} from "class-validator";

export class PipSettings
{
    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsPositive()
    @IsNumber()
    @IsDefined()
    readonly step: number;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsMultipleOf("step")
    @IsPositive()
    @IsNumber()
    @IsOptional()
    readonly milestoneStep?: number;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsBoolean()
    @IsOptional()
    readonly canSnapToPip?: boolean;
}
