declare module 'posthtml-component' {
  declare function plugin<TThis>(
    options?: import('posthtml-bootstrap').PostHTMLComponentOptions
  ): import('posthtml').Plugin<TThis>

  export default plugin
}

declare module 'posthtml-extend' {
  declare function plugin<TThis>(
    options?: PostHTMLExtendOptions
  ): import('posthtml').Plugin<TThis>

  /**
   * Options that can be passed to the PostHTML extend plugin.
   */
  export interface PostHTMLExtendOptions {
    /**
     * The path to the root template directory.
     *
     * @default './'
     */
    root?: string

    /**
     * The encoding of the parent template.
     *
     * @default 'utf8'
     */
    encoding?: string

    /**
     * Whether the plugin should disallow undeclared block names.
     *
     * @default true
     */
    strict?: boolean

    /**
     * The tag name to use for slots.
     *
     * @default 'slot'
     */
    slotTagName?: string

    /**
     * The tag name to use for fill elements.
     *
     * @default 'block'
     */
    fillTagName?: string

    /**
     * The tag name to use when extending.
     *
     * @default 'extends'
     */
    tagName?: string

    /**
     * This option accepts an object to configure `posthtml-expressions`. You
     * can pre-set locals or customize the delimiters for example.
     *
     * @default {}
     */
    expressions?: object
  }

  export default plugin
}
