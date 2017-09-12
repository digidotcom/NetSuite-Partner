{{#if isNew}}
<div data-action="case-fileupload-remove-file" class="case-fileupload-remove" title="{{translate 'Remove'}}" data-id="{{ fileID }}" >
       <i class="case-fileupload-remove-icon"></i>
</div>
{{/if}}
<a href="{{ imageLink }}" target="_blank">
    <img src="{{ imageThumbnail }}" data-type="case-fileupload-image">
</a>