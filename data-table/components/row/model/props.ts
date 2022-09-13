import {IsString} from "@miniskylab/antimatter-class-validator";
import {ComponentProps} from "@miniskylab/antimatter-model";
import {IsOptional} from "class-validator";
import {MouseEventHandler} from "react";

export class DataTableRowProps extends ComponentProps
{
    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsString({each: true})
    @IsOptional()
    readonly cells?: string[];


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    readonly onClick?: MouseEventHandler;
}
