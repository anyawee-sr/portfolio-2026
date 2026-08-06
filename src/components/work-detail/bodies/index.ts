import type { ComponentType } from "react";

import type { TCaseStudySlug } from "@/data/caseStudies";

import { BuildingsRefuseToFade } from "./BuildingsRefuseToFade";
import { DataLayerNewEntity } from "./DataLayerNewEntity";
import { EditingTaughtMeTiming } from "./EditingTaughtMeTiming";
import { NewMemberOnTheMap } from "./NewMemberOnTheMap";

export const workDetailBodies: Record<TCaseStudySlug, ComponentType> = {
  "data-layer-new-entity": DataLayerNewEntity,
  "new-member-on-the-map": NewMemberOnTheMap,
  "buildings-refuse-to-fade": BuildingsRefuseToFade,
  "editing-taught-me-timing": EditingTaughtMeTiming,
};
