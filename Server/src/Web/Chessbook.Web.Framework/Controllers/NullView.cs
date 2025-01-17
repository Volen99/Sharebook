﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;

namespace Chessbook.Web.Framework
{
    public class NullView : IView
    {
        public static readonly NullView Instance = new NullView();

        public string Path => string.Empty;

        /// <returns>A task that represents the asynchronous operation</returns>
        public Task RenderAsync(ViewContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            return Task.CompletedTask;
        }
    }
}
