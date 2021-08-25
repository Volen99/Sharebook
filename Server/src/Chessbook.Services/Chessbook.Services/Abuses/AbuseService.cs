﻿using Chessbook.Core.Domain.Abuse;
using Chessbook.Data;
using Microsoft.EntityFrameworkCore;
using Nop.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chessbook.Services.Abuses
{
    public class AbuseService : IAbuseService
    {
        private readonly IRepository<Abuse> abuseRepository;

        public AbuseService(IRepository<Abuse> abuseRepository)
        {
            this.abuseRepository = abuseRepository;
        }

        public async Task<int> CreateAccountAbuse(int reporterAccountId, string reason, AbuseState state, string predefinedReasons, int flaggedAccountId)
        {
            var abuseNew = new Abuse
            {
                ReporterAccountId = reporterAccountId,
                FlaggedAccountId = flaggedAccountId,
                Reason = reason,
                PredefinedReasons = predefinedReasons,
                State = state,
                CreatedAt = DateTime.UtcNow,
            };

            await this.abuseRepository.InsertAsync(abuseNew);

            return abuseNew.Id;
        }

        public async Task<IPagedList<Abuse>> ListMyAbuses(int start, int count, string sort, int? id = null, string search = null,
            AbuseState? abuseState = 0, int? customerId = null)
        {
            var abuses = await this.abuseRepository.GetAllPagedAsync(query =>
            {
                // user
                if (customerId.HasValue && customerId.Value > 0)
                {
                    query = query.Where(a => a.ReporterAccountId == customerId);
                }

                query = query.OrderByDescending(a => a.CreatedAt).ThenBy(a => a.Id);

                return query;
            }, start, count);

            return abuses;
        }

        public async Task<IPagedList<Abuse>> ListAbusesForAdmins(int start, int count, string sort, string filter, int? accountId = null, int? id = null,
            List<string> predefinedReasons = null, AbuseState? abuseState = 0, string videoIs = null, string search = null, string searchReporter = null,
            string searchReportee = null, string searchVideo = null)
        {
            var abuses = await this.abuseRepository.GetAllPagedAsync(query =>
            {
                query = query.OrderByDescending(a => a.CreatedAt).ThenBy(a => a.Id);

                return query;
            }, start, count);

            return abuses;
        }

        public async Task<Abuse> LoadByIdWithReporter(int id)
        {
            var abuse = await this.abuseRepository.Table.Where(a => a.ReporterAccountId == id)
                .Include(x => x.ReporterAccount)
                .FirstOrDefaultAsync();

            return abuse;
        }
    }
}