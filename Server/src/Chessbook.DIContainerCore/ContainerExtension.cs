﻿namespace Chessbook.DIContainerCore
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;

    using Chessbook.Data;
    using Chessbook.Data.Common;
    using Chessbook.Data.Common.Repositories;
    using Chessbook.Data.Models;
    using Chessbook.Data.Repositories;
    using Chessbook.Services;
    using Chessbook.Services.Data.Services;
    using Chessbook.Services.Data.Services.Contacts;
    using Chessbook.Services.Data.Services.Entities;
    using Chessbook.Services.Data.Services.Phone;
    using Chessbook.Services.Data.Services.Upload;
    using Chessbook.Services.Data.Services.Media;
    using Nop.Core.Infrastructure;
    using Nop.Services.Common;
    using Chessbook.Core.JsonConverters;
    using Chessbook.Core.JsonConverters.Logic;
    using Chessbook.Services.Data;
    using Nop.Core.Caching;
    using Nop.Core.Configuration;
    using Microsoft.Extensions.Caching.Memory;
    using Nop.Services.Helpers;

    public static class ContainerExtension
    {
        public static void Initialize(IServiceCollection services, string connectionString)
        {
            services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));

            services.AddScoped<IDataBaseInitializer, DataBaseInitializer>();

            // Data repositories
            services.AddScoped(typeof(IDeletableEntityRepository<>), typeof(EfDeletableEntityRepository<>));
            services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
            services.AddScoped<IDbQueryRunner, DbQueryRunner>();

            // Application services
            services.AddTransient<ISettingsService, SettingsService>();
            services.AddTransient<ISettingsRepository, SettingsRepository>();
            services.AddTransient<IUserPhotoRepository, UserPhotoRepository>();
            services.AddTransient<IUserService, UserService<User>>();
            services.AddTransient<IUserRepository<User>, UserRepository>();
            services.AddTransient<IIdentityUserRepository<User>, IdentityUserRepository>();
            services.AddTransient<IRoleRepository<Role>, RoleRepository>();
            services.AddTransient<IUserRoleRepository<UserRole>, UserRoleRepository>();
            services.AddTransient<IUserClaimRepository<UserClaim>, UserClaimRepository>();

            services.AddTransient<IUploadService, UploadService>();
            services.AddTransient<IMediaService, MediaService>();
            services.AddTransient<IPostsService, PostsService>();
            services.AddTransient<IPollService, PollService>();

            services.AddScoped<IPictureService, PictureService>();
            services.AddScoped<INopFileProvider, NopFileProvider>();
            services.AddScoped<IGenericAttributeService, GenericAttributeService>();
            services.AddTransient<IStreamersService, StreamersService>();
            services.AddTransient<IRelationshipService, RelationshipService>();



            // IOT - E-Commerce
            services.AddTransient<IContactService, ContactService>();
            services.AddTransient<IPhoneCallService, PhoneCallService>();


            services.AddTransient<IJsonObjectConverter, JsonObjectConverter>();
            services.AddTransient<IJsonConvertWrapper, JsonConvertWrapper>();

            //static cache manager
            //if (appSettings.DistributedCacheConfig.Enabled)
            //{
            //    services.AddScoped<ILocker, DistributedCacheManager>();
            //    services.AddScoped<IStaticCacheManager, DistributedCacheManager>();
            //}
            //else
            //{
            //    services.AddSingleton<ILocker, MemoryCacheManager>();
            //    services.AddSingleton<IStaticCacheManager, MemoryCacheManager>();
            //}

            services.AddSingleton<IMemoryCache>(new MemoryCache(new MemoryCacheOptions())); // might bug

            services.AddSingleton<ILocker, MemoryCacheManager>();
            services.AddSingleton<IStaticCacheManager, MemoryCacheManager>();

            services.AddSingleton<AppSettings, AppSettings>(); // might bug

            services.AddScoped<IDateTimeHelper, DateTimeHelper>();
        }
    }
}