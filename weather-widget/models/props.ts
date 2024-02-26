import {ComponentName, ComponentProps, IsDefined} from "@miniskylab/antimatter-framework";
import {Type} from "class-transformer";
import {ValidateNested} from "class-validator";
import {SimpleWeatherData} from "../components";
import {ShortWeatherData, TemperatureData, WindData} from "../types";
import {WeatherWidgetStyle} from "./style";

@ComponentName("Weather Widget")
export class WeatherWidgetProps extends ComponentProps<WeatherWidgetStyle>
{
    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => ShortWeatherData)
    readonly locationData: ShortWeatherData;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => ShortWeatherData)
    readonly lastUpdateData: ShortWeatherData;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => ShortWeatherData)
    readonly weatherConditionData: ShortWeatherData;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => TemperatureData)
    readonly temperatureData: TemperatureData;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => ShortWeatherData)
    readonly uvIndexData: ShortWeatherData;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => WindData)
    readonly windData: WindData;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     *
     * @type SimpleWeatherData
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => SimpleWeatherData.Props)
    readonly simpleWeatherData1: SimpleWeatherData.Props;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     *
     * @type SimpleWeatherData
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => SimpleWeatherData.Props)
    readonly simpleWeatherData2: SimpleWeatherData.Props;


    /**
     * <i style="color: #9B9B9B">(not available)</i>
     *
     * @type SimpleWeatherData
     */
    @IsDefined()
    @ValidateNested()
    @Type(() => SimpleWeatherData.Props)
    readonly simpleWeatherData3: SimpleWeatherData.Props;
}
