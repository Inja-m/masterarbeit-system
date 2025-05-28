import type { Schema, Struct } from '@strapi/strapi';

export interface MediaLink extends Struct.ComponentSchema {
  collectionName: 'components_media_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    link: Schema.Attribute.String;
  };
}

export interface MediaPictures extends Struct.ComponentSchema {
  collectionName: 'components_media_pictures';
  info: {
    description: '';
    displayName: 'Pictures';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    Link: Schema.Attribute.Component<'media.link', true>;
    pictures: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface MediaText extends Struct.ComponentSchema {
  collectionName: 'components_media_texts';
  info: {
    description: '';
    displayName: 'Text';
    icon: 'layer';
  };
  attributes: {
    text: Schema.Attribute.RichText;
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
      'media.link': MediaLink;
      'media.pictures': MediaPictures;
      'media.text': MediaText;
      'media.totality': MediaTotality;
    }
  }
}
