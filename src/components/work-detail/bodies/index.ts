import type { ComponentType } from "react";

import type { TCaseStudySlug } from "@/data/caseStudies";

import { BuildingsRefuseToComeBack } from "@/components/work-detail/bodies/BuildingsRefuseToComeBack";
import { DataLayerNewEntity } from "@/components/work-detail/bodies/DataLayerNewEntity";
import { ThatsAWrap } from "@/components/work-detail/bodies/ThatsAWrap";
import { NewMemberOnTheMap } from "@/components/work-detail/bodies/NewMemberOnTheMap";

export const workDetailBodies: Record<TCaseStudySlug, ComponentType> = {
  "data-layer-new-entity": DataLayerNewEntity,
  "new-member-on-the-map": NewMemberOnTheMap,
  "buildings-refuse-to-come-back": BuildingsRefuseToComeBack,
  "thats-a-wrap": ThatsAWrap,
};
