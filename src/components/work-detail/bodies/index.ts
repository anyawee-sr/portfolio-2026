import type { ComponentType } from "react";

import type { TCaseStudySlug } from "@/data/caseStudies";

import { BuildingsRefuseToComeBack } from "@/components/work-detail/bodies/BuildingsRefuseToComeBack";
import { DataLayerNewEntity } from "@/components/work-detail/bodies/DataLayerNewEntity";
import { ThatsAWrapOnMyEditingEra } from "@/components/work-detail/bodies/ThatsAWrapOnMyEditingEra";
import { NewMemberOnTheMap } from "@/components/work-detail/bodies/NewMemberOnTheMap";

export const workDetailBodies: Record<TCaseStudySlug, ComponentType> = {
  "data-layer-new-entity": DataLayerNewEntity,
  "new-member-on-the-map": NewMemberOnTheMap,
  "buildings-refuse-to-come-back": BuildingsRefuseToComeBack,
  "thats-a-wrap-on-my-editing-era": ThatsAWrapOnMyEditingEra,
};
