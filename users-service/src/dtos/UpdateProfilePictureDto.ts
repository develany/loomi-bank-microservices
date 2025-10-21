/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfilePictureDto:
 *       type: object
 *       required:
 *         - profilePicture
 *       properties:
 *         profilePicture:
 *           type: string
 *           description: URL or base64 encoded image for the profile picture
 */
export interface UpdateProfilePictureDto {
  profilePicture: string;
}