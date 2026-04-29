import { IsNotEmpty, IsUrl } from "class-validator";

export class DeleteUrlDto {
	@IsNotEmpty({ message: "The url must not be empty." })
	@IsUrl({}, { message: "The url must be a valid URL." })
	originalUrl: string;
}
