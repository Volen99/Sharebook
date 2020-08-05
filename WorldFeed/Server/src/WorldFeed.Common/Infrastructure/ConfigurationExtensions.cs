﻿namespace WorldFeed.Common.Infrastructure
{
    using Microsoft.Extensions.Configuration;

    public static class ConfigurationExtensions
    {
        public static string GetDefaultConnectionString(this IConfiguration configuration)
            => configuration.GetConnectionString("DefaultConnection");

        // by me
        public static string GetConnectionString(this IConfiguration configuration)
        {
            return configuration.GetConnectionString("ConnectionString");
        }
    }
}
