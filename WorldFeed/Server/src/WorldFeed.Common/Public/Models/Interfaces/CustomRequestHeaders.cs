namespace WorldFeed.Common.Public.Models.Interfaces
{
    using System.Collections;
    using System.Collections.Generic;

    public enum CustomHeaderWill
    {
        /// <summary>
        /// <para>If a header with the same name was generated by Tweetinvi, its value will be overriden by the custom header value</para>
        /// <para>If no header with the custom header name was generated by Tweetinvi, the header will be created</para>
        /// </summary>
        OverrideGeneratedHeaders,

        /// <summary>
        /// <para>If a header with the same name was generated by Tweetinvi, the value will be added to the list of the header values</para>
        /// <para>If no header with the custom header name was generated by Tweetinvi, the header will be created</para>
        /// </summary>
        BeAddedToGeneratedHeaders,

        /// <summary>
        /// Removes any header generated by Tweetinvi
        /// </summary>
        RemoveGeneratedHeaders
    }

    public class CustomHeader
    {
        public CustomHeader(string key)
        {
            Key = key;
            Values = new List<string>();
            Behaviour = CustomHeaderWill.OverrideGeneratedHeaders;
        }

        public string Key { get; }

        public List<string> Values { get; }

        public CustomHeaderWill Behaviour { get; set; }
    }

    public class CustomRequestHeaders : IEnumerable<CustomHeader>
    {
        private Dictionary<string, CustomHeader> customHeaders;

        public CustomRequestHeaders()
        {
            this.customHeaders = new Dictionary<string, CustomHeader>();
        }

        public void Add(string key, string value)
        {
            Add(key, value, CustomHeaderWill.OverrideGeneratedHeaders);
        }

        public void Add(string key, List<string> values)
        {
            Add(key, values, CustomHeaderWill.OverrideGeneratedHeaders);
        }

        public void Add(string key, string value, CustomHeaderWill behaviour)
        {
            Add(key, new [] { value }, behaviour);
        }

        public void Add(string key, IEnumerable<string> values, CustomHeaderWill behaviour)
        {
            if (!this.customHeaders.TryGetValue(key, out var currentValue) || currentValue == null)
            {
                currentValue = new CustomHeader(key);
            }

            currentValue.Behaviour = behaviour;
            currentValue.Values.AddRange(values);
            this.customHeaders[key] = currentValue;
        }

        public void Add(CustomHeader customHeader)
        {
            if (customHeader.Values == null)
            {
                this.customHeaders.Remove(customHeader.Key);
            }
            else
            {
                this.customHeaders[customHeader.Key] = customHeader;
            }
        }

        public CustomHeader Get(string key)
        {
            return this.customHeaders[key];
        }

        public void Remove(string key)
        {
            this.customHeaders.Remove(key);
        }

        public CustomHeader this[string key] => Get(key);

        public IEnumerator<CustomHeader> GetEnumerator()
        {
            return this.customHeaders.Values.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
