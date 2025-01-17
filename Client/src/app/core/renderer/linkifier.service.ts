import {Injectable} from '@angular/core';

@Injectable()
export class LinkifierService {
  static CLASSNAME = 'linkified';

  private linkifyModule: any;
  private linkifyHtmlModule: any;

  private linkifyOptions = {
    className: {
      mention: LinkifierService.CLASSNAME + '-mention',
      url: LinkifierService.CLASSNAME + '-url'
    },
    formatHref: {
      mention: (href: string) => {
        return `/${href.substr(1)}`;
      }
    }
  };

  async linkify(text: string) {
    if (!this.linkifyModule) {
      const result = await Promise.all([
        import('linkifyjs'),
        import('linkify-plugin-mention'),
        import('linkify-html').then(m => (m as any).default)
      ]);

      this.linkifyModule = result[0];
      this.linkifyHtmlModule = result[2];
    }

    return this.linkifyHtmlModule(text, this.linkifyOptions);
  }
}
