﻿namespace Chessbook.Common.Extensions
{
    using System;

    public static class UriExtensions
    {
        public static string GetEndpointURL(this Uri uri)
        {
            // Other solution : uri.AbsoluteUri.Replace(uri.Query, "");
            return string.Format("{0}://{1}{2}", uri.Scheme, uri.Host, uri.AbsolutePath);
        }
    }
}
