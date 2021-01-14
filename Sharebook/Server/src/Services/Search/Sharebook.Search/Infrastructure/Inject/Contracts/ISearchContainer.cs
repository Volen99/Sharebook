﻿namespace Sharebook.Search.Infrastructure.Inject.Contracts
{
    using System;
    using System.Collections.Generic;
    using Autofac;

    using Sharebook.Common.InjectWorldFeed;
    using Sharebook.Common.Models.Enums;
    using Sharebook.Search.Application.IntegrationEvents.Events;

    public interface ISearchContainer
    {
        bool IsInitialized { get; }

        List<Action<ContainerBuilder>> RegistrationActions { get; }

        ITwitterClient AssociatedClient { get; set; }z

        event EventHandler<SearchContainerEventArgs> BeforeRegistrationCompletes;

        void Initialize();

        void RegisterType<TRegistered, TTo>(RegistrationLifetime registrationLifetime = RegistrationLifetime.InstancePerResolve)
            where TTo : TRegistered;

        void RegisterGeneric(Type sourceType, Type targetType, RegistrationLifetime registrationLifetime = RegistrationLifetime.InstancePerResolve);

        void RegisterInstance(Type targetType, object value);

        void RegisterDecorator<TDecorator, TDecorated>() where TDecorator : TDecorated;

        T Resolve<T>(params IConstructorNamedParameter[] parameters);
    }
}