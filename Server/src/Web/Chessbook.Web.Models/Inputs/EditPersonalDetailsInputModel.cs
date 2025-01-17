﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chessbook.Web.Models.Inputs
{
    public class EditPersonalDetailsInputModel
    {
        public string DisplayName { get; set; }

        public string Description { get; set; }

        public string Gender { get; set; }

        public int? DateOfBirthDay { get; set; }

        public int? DateOfBirthMonth { get; set; }

        public int? DateOfBirthYear { get; set; }

        public DateTime? ParseDateOfBirth()
        {
            if (!DateOfBirthYear.HasValue || !DateOfBirthMonth.HasValue || !DateOfBirthDay.HasValue)
            {
                return null;
            }

            DateTime? dateOfBirth = null;
            try
            {
                dateOfBirth = new DateTime(DateOfBirthYear.Value, DateOfBirthMonth.Value, DateOfBirthDay.Value);
            }
            catch 
            {

            }

            return dateOfBirth;
        }

        public string WebsiteLink { get; set; }

        public string TwitterLink { get; set; }

        public string TwitchLink { get; set; }

        public string YoutubeLink { get; set; }

        public string FacebookLink { get; set; }

        public string InstagramLink { get; set; }

        public int CountryId { get; set; }

        public string TimeZoneId { get; set; }
    }
}
