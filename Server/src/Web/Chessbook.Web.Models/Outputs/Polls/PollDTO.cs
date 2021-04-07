﻿using Chessbook.Data.Models.Polls;
using Chessbook.Services.Mapping;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chessbook.Web.Models.Outputs.Polls
{
    public class PollDTO : IMapTo<Poll>
    {
        public PollDTO()
        {
            this.Options = new List<PollOptionDTO>();
        }

        public int Id { get; set; }

        public string Question { get; set; }

        public string SystemKeyword { get; set; }

        public bool Published { get; set; }

        public bool AllowGuestsToVote { get; set; }

        public DateTime StartDateUtc { get; set; }

        public DateTime? EndDateUtc { get; set; }

        public IEnumerable<PollOptionDTO> Options { get; set; }

        public bool Expired { get; set; }

        public bool Voted { get; set; }

        [JsonProperty("votes_count")]
        public int VotesCount { get; set; }

        [JsonProperty("voters_count")]

        public int VotersCount { get; set; }

        [JsonProperty("own_votes")]
        public int[] OwnVotes { get; set; }
    }
}
