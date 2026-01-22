async function protect(){
 const {data}=await supabase.auth.getUser();
 if(!data.user) location="agent.html";
}
protect();

async function addCase(){
 await supabase.from("cases").insert({
  title:title.value,
  description:desc.value
 });
 alert("Case added");
}

async function uploadVideo(){
 const file=videoFile.files[0];
 const path=`videos/${Date.now()}_${file.name}`;

 await supabase.storage.from("videos").upload(path,file);

 const {data}=supabase.storage.from("videos").getPublicUrl(path);

 await supabase.from("videos").insert({
  title:videoTitle.value,
  url:data.publicUrl
 });

 alert("Video uploaded");
}