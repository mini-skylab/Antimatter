import {Export} from "@miniskylab/antimatter/infrastructures";
import {LabelVariant} from "../variants";
import {LabelComponentProps} from "./label-component-props";

export type LabelExportProps = Export<LabelComponentProps, LabelVariant>;
