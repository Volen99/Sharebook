﻿namespace WorldFeed.Services.Identity
{
    using System;
    using System.Security.Claims;
    using Microsoft.AspNetCore.Http;

    using Infrastructure;

    public class CurrentUserService : ICurrentUserService
    {
        private readonly ClaimsPrincipal user;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            this.user = httpContextAccessor.HttpContext?.User;

            if (user == null)
            {
                throw new InvalidOperationException("This request does not have an authenticated user.");
            }

            this.UserId = this.user.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public string UserId { get; }

        public bool IsAdministrator => this.user.IsAdministrator();
    }
}
