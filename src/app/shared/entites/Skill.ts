export class Skill {
  id?: string;
  skillName?: string;
  skillLevel?: string;
  skillStringValue?: string;
  skillduration?: number;
  archived?: boolean = false;
  archivedDate;
  chain = [];
}
