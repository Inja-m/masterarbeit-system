import type { Schema, Struct } from '@strapi/strapi';

export interface MediaContext extends Struct.ComponentSchema {
  collectionName: 'components_media_contexts';
  info: {
    displayName: 'Context';
    icon: 'bulletList';
  };
  attributes: {
    link: Schema.Attribute.Component<'media.link', true>;
    text: Schema.Attribute.Component<'media.text', true>;
  };
}

export interface MediaLink extends Struct.ComponentSchema {
  collectionName: 'components_media_links';
  info: {
    description: '';
    displayName: 'Link';
  };
  attributes: {
    label: Schema.Attribute.String;
    link: Schema.Attribute.String;
  };
}

export interface MediaPicture extends Struct.ComponentSchema {
  collectionName: 'components_media_picture';
  info: {
    description: '';
    displayName: 'Picture';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    picture: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
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

export interface MediaResearch extends Struct.ComponentSchema {
  collectionName: 'components_media_research';
  info: {
    description: '';
    displayName: 'Research';
    icon: 'discuss';
  };
  attributes: {
    abstract: Schema.Attribute.RichText;
    bibliography: Schema.Attribute.JSON;
    context: Schema.Attribute.Component<'media.context', false>;
    disscussion: Schema.Attribute.RichText;
    researchDesign: Schema.Attribute.Component<'media.picture', false>;
    researchQuestion: Schema.Attribute.Component<
      'media.research-question',
      true
    >;
    results: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface MediaResearchQuestion extends Struct.ComponentSchema {
  collectionName: 'components_media_research_questions';
  info: {
    description: '';
    displayName: 'Research Question';
    icon: 'question';
  };
  attributes: {
    question: Schema.Attribute.String;
    subquestion: Schema.Attribute.Component<'media.subquestion', true>;
  };
}

export interface MediaSubquestion extends Struct.ComponentSchema {
  collectionName: 'components_media_subquestions';
  info: {
    displayName: 'subquestion';
    icon: 'question';
  };
  attributes: {
    subquestion: Schema.Attribute.Text;
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
      'media.context': MediaContext;
      'media.link': MediaLink;
      'media.picture': MediaPicture;
      'media.pictures': MediaPictures;
      'media.research': MediaResearch;
      'media.research-question': MediaResearchQuestion;
      'media.subquestion': MediaSubquestion;
      'media.text': MediaText;
      'media.totality': MediaTotality;
    }
  }
}
