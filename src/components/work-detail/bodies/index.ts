import type { ComponentType } from "react";

import type { TCaseStudySlug } from "@/data/caseStudies";

import { BuildingsRefuseToComeBack } from "@/components/work-detail/bodies/BuildingsRefuseToComeBack";
import { DataLayerNewEntity } from "@/components/work-detail/bodies/DataLayerNewEntity";
import { EditingTaughtMeTiming } from "@/components/work-detail/bodies/EditingTaughtMeTiming";
import { NewMemberOnTheMap } from "@/components/work-detail/bodies/NewMemberOnTheMap";

export const workDetailBodies: Record<TCaseStudySlug, ComponentType> = {
  "data-layer-new-entity": DataLayerNewEntity,
  "new-member-on-the-map": NewMemberOnTheMap,
  "buildings-refuse-to-fade": BuildingsRefuseToComeBack,
  "editing-taught-me-timing": EditingTaughtMeTiming,
};
