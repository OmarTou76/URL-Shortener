import { IsNotEmpty, IsUrl } from "class-validator";
// id String @id @default (uuid()) @db.Uuid
// originalUrl String REQUIRED @unique
// shortCode String @unique
// createdAt DateTime @default (now())
export class CreateUrlDto {
	@IsNotEmpty({ message: "The url must not be empty." })
	@IsUrl({}, { message: "The url must be a valid URL." })
	originalUrl: string;
}
