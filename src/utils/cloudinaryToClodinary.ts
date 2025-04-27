
export const uploadToCloudinary = async(file:File) =>{

    const UPLOAD_PRESET = "chat-media";
    const CLOUD_NAME = "dy3yrxbmg";

    const formData = new FormData()

    formData.append("file",file);
    formData.append("upload_preset",UPLOAD_PRESET)


    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{
        method:"POST",
        body:formData
    })


    if(!response.ok){
        throw new Error("Cloudinary upload failed");
    }



    const data = await response.json();

    return {
      secure_url: data.secure_url,
      resource_type: data.resource_type, // image, video, raw
      original_filename: data.original_filename,
      mimeType: file.type,
    };



    



}
