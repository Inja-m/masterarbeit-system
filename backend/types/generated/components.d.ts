import type { Schema, Struct } from '@strapi/strapi';

export interface MediaPictures extends Struct.ComponentSchema {
  collectionName: 'components_media_pictures';
  info: {
    description: '';
    displayName: 'Pictures';
    icon: 'picture';
  };
  attributes: {
    pictures: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface MediaText extends Struct.ComponentSchema {
  collectionName: 'components_media_texts';
  info: {
    displayName: 'Text';
    icon: 'layer';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

export interface MediaTotality extends Struct.ComponentSchema {
  collectionName: 'components_media_images';
  info: {
    description: '';
    displayName: 'Totality';
    icon: 'bulletList';
  };
  attributes: {
    Pictures: Schema.Attribute.Component<'media.pictures', true>;
    Text: Schema.Attribute.Component<'media.text', true>;
    workshop_group: Schema.Attribute.Relation<
      'oneToOne',
      'api::workshop-group.workshop-group'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'media.pictures': MediaPictures;
      'media.text': MediaText;
      'media.totality': MediaTotality;
    }
  }
}
