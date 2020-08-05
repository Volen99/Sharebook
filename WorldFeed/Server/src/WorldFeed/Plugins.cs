﻿namespace WorldFeed
{
    using System;

    // ReSharper disable once RedundantUsingDirective
    using WorldFeed.Common.InjectWorldFeed;

    public static class Plugins
    {
        public static void Add<T>()
            where T : ITweetinviModule
        {
            var type = typeof(T);

            var ctor = type.GetConstructor(new Type[0]);

            if (ctor == null)
            {
                throw new InvalidOperationException("This class is not a plugin that can be added as no valid ctor could be identified");
            }

            var instance = ctor.Invoke(null);
            var module = (T)instance;

            TweetinviContainer.AddModule(module);
        }
    }
}
