/**
 * Storage permissions.
 *
 * @id - Used to identify the rule on permissions and upload.
 * @folder - Folder where the files will be saved
 * @maxSizeInBytes - Max allowed size in bytes
 * @bypassWritingPermissions - Does not validate if the user has permission to write
 */
export default class Storage {
  static get values() {
    return {


      productPhotos: {
        id: 'productPhotos',
        folder: 'product/photos',
        maxSizeInBytes: 1000000,
      },

      orderAttachments: {
        id: 'orderAttachments',
        folder: 'order/attachments',
        maxSizeInBytes: 1000000,
      },
      userAvatarsProfiles: {
        id: 'userAvatarsProfiles',
        folder: 'user/avatars/profile/:userId',
        maxSizeInBytes: 10 * 1024 * 1024,
        bypassWritingPermissions: true,
      },
    };
  }
}
