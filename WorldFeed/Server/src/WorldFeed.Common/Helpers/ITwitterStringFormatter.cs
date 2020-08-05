﻿namespace WorldFeed.Common.Helpers
{
    public interface ITwitterStringFormatter
    {
        string TwitterEncode(string source);

        string TwitterDecode(string source);
    }
}
