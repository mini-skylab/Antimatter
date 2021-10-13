import {ComponentName, ComponentProps} from "@miniskylab/antimatter/infrastructure";
import {IsDefined, IsNotEmpty, IsString} from "@miniskylab/antimatter/validation";

@ComponentName("Label")
export class LabelComponentProps extends ComponentProps
{
    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    readonly text: string;
}
