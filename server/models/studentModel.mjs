export class Student {
  constructor(
    id,
    phoneNumber,
    verified,
    name = "NA",
    language = "NA",
    level = "NA",
    progress = 0
  ) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.verified = verified;
    this.language = language;
    this.level = level;
    this.progress = progress;
  }
}
