import {RegisterClientFormFieldOptions, RegisterClientHookOptions, RegisterClientVideoFieldOptions} from "../app/shared/models/plugins";

export type RegisterClientOptions = {
  registerHook: (options: RegisterClientHookOptions) => void

  registerVideoField: (commonOptions: RegisterClientFormFieldOptions, videoFormOptions: RegisterClientVideoFieldOptions) => void

  peertubeHelpers: RegisterClientHelpers
};

export type RegisterClientHelpers = {
  getBaseStaticRoute: () => string

  isLoggedIn: () => boolean

  getSettings: () => Promise<{ [name: string]: string }>

  notifier: {
    info: (text: string, title?: string, timeout?: number) => void,
    error: (text: string, title?: string, timeout?: number) => void,
    success: (text: string, title?: string, timeout?: number) => void
  }

  showModal: (input: {
    title: string,
    content: string,
    close?: boolean,
    cancel?: { value: string, action?: () => void },
    confirm?: { value: string, action?: () => void }
  }) => void

  markdownRenderer: {
    textMarkdownToHTML: (textMarkdown: string) => Promise<string>
    enhancedMarkdownToHTML: (enhancedMarkdown: string) => Promise<string>
  }

  translate: (toTranslate: string) => Promise<string>
};
