import {Export} from "@miniskylab/antimatter/infrastructures";
import {DataTableVariant} from "../variants";
import {DataTableComponentProps} from "./data-table-component-props";

export type DataTableExportProps = Export<DataTableComponentProps, DataTableVariant>;
