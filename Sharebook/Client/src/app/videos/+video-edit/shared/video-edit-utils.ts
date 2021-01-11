import {FormGroup} from '@angular/forms';
import {VideoEdit} from "../../../shared/main/video/video-edit.model";

function hydrateFormFromVideo(formGroup: FormGroup, video: VideoEdit, thumbnailFiles: boolean) {
  formGroup.patchValue(video.toFormPatch());

  if (thumbnailFiles === false) {
    return;
  }

  const objects = [
    {
      url: 'thumbnailUrl',
      name: 'thumbnailfile'
    },
    {
      url: 'previewUrl',
      name: 'previewfile'
    }
  ];

  for (const obj of objects) {
    if (!video[obj.url]) {
      continue;
    }

    fetch(video[obj.url])
      .then(response => response.blob())
      .then(data => {
        formGroup.patchValue({
          [obj.name]: data
        });
      });
  }
}

export {
  hydrateFormFromVideo
};
