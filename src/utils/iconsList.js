import {
  FaQuestion,
  FaColumns,
  FaPlus,
  FaCode,
  FaList,
  FaWindowMinimize,
  FaAngleUp,
  FaAlignJustify,
  FaJs
} from "react-icons/fa";
import { AiOutlineScissor } from "react-icons/ai";

export const IconsList = {
  Constant: FaWindowMinimize,
  Column: FaColumns,
  HL7: FaAngleUp,
  Conditional: FaQuestion,
  Combination: FaPlus,
  Regex: AiOutlineScissor,
  Iteration: FaList,
  Function: FaCode,
  Switch: FaAlignJustify,
  JsonProperty: FaJs,
  JsonElement: FaJs,
  Aggregate: FaJs,
};

export const DataFieldsIconsList = {
  Constant: FaWindowMinimize,
  Column: FaColumns,
  HL7: FaAngleUp,
  JsonProperty: FaJs,
};

export const LogicalFieldsIconsList = {
  Conditional: FaQuestion,
  Combination: FaPlus,
  Regex: AiOutlineScissor,
  Iteration: FaList,
  Function: FaCode,
  Switch: FaAlignJustify,
  JsonElement: FaJs,
  Aggregate: FaJs,
};