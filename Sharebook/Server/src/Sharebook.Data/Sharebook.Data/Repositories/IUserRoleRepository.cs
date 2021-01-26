﻿namespace Sharebook.Data.Repositories
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Sharebook.Data.Models;
    using Sharebook.Data.Models.System;

    public interface IUserRoleRepository<TUserRole> where TUserRole : UserRole
    {
        Task<TUserRole> Add(TUserRole userRole, ContextSession session);
        Task<TUserRole> Get(int userId, int roleId, ContextSession session);
        Task Delete(int userId, int roleId, ContextSession session);
        Task<IList<string>> GetByUserId(int userId, ContextSession session);
    }
}