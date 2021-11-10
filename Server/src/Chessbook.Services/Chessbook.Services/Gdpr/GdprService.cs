﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Chessbook.Core;
using Chessbook.Core.Domain.Customers;
using Chessbook.Core.Domain.Gdpr;
using Chessbook.Core.Events;
using Chessbook.Data;
using Chessbook.Data.Models;
using Chessbook.Services.Chat;
using Chessbook.Services.Common;
using Chessbook.Services.Data.Services.Entities;
using Chessbook.Services.Entities;
using Chessbook.Services.Stores;

namespace Chessbook.Services.Gdpr
{
    /// <summary>
    /// Represents the GDPR service
    /// </summary>
    public partial class GdprService : IGdprService
    {
        #region Fields

        private readonly IUserService _customerService;
        private readonly IEventPublisher _eventPublisher;
        private readonly IGenericAttributeService _genericAttributeService;
        private readonly IPostsService postService;
        private readonly IRepository<GdprConsent> _gdprConsentRepository;
        private readonly IRepository<GdprLog> _gdprLogRepository;
        private readonly IStoreService _storeService;
        private readonly IPostCommentService postCommentService;
        private readonly IChatService chatService;

        #endregion

        #region Ctor

        public GdprService(IUserService customerService,
            IEventPublisher eventPublisher,
            IGenericAttributeService genericAttributeService,
            IRepository<GdprConsent> gdprConsentRepository,
            IRepository<GdprLog> gdprLogRepository,
            IStoreService storeService,
            IPostsService postService,
            IPostCommentService postCommentService,
            IChatService chatService)
        {
            _customerService = customerService;
            _eventPublisher = eventPublisher;
            _genericAttributeService = genericAttributeService;
            _gdprConsentRepository = gdprConsentRepository;
            _gdprLogRepository = gdprLogRepository;
            _storeService = storeService;
            this.postService = postService;
            this.postCommentService = postCommentService;
            this.chatService = chatService;
        }

        #endregion

        #region Utilities

        /// <summary>
        /// Insert a GDPR log
        /// </summary>
        /// <param name="gdprLog">GDPR log</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        protected virtual async Task InsertLogAsync(GdprLog gdprLog)
        {
            await _gdprLogRepository.InsertAsync(gdprLog);
        }

        #endregion

        #region Methods

        #region GDPR consent

        /// <summary>
        /// Get a GDPR consent
        /// </summary>
        /// <param name="gdprConsentId">The GDPR consent identifier</param>
        /// <returns>
        /// A task that represents the asynchronous operation
        /// The task result contains the gDPR consent
        /// </returns>
        public virtual async Task<GdprConsent> GetConsentByIdAsync(int gdprConsentId)
        {
            return await _gdprConsentRepository.GetByIdAsync(gdprConsentId, cache => default);
        }

        /// <summary>
        /// Get all GDPR consents
        /// </summary>
        /// <returns>
        /// A task that represents the asynchronous operation
        /// The task result contains the gDPR consent
        /// </returns>
        public virtual async Task<IList<GdprConsent>> GetAllConsentsAsync()
        {
            var gdprConsents = await _gdprConsentRepository.GetAllAsync(query =>
            {
                return from c in query
                    orderby c.DisplayOrder, c.Id
                    select c;
            }, cache => default);

            return gdprConsents;
        }

        /// <summary>
        /// Insert a GDPR consent
        /// </summary>
        /// <param name="gdprConsent">GDPR consent</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        public virtual async Task InsertConsentAsync(GdprConsent gdprConsent)
        {
            await _gdprConsentRepository.InsertAsync(gdprConsent);
        }

        /// <summary>
        /// Update the GDPR consent
        /// </summary>
        /// <param name="gdprConsent">GDPR consent</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        public virtual async Task UpdateConsentAsync(GdprConsent gdprConsent)
        {
            await _gdprConsentRepository.UpdateAsync(gdprConsent);
        }

        /// <summary>
        /// Delete a GDPR consent
        /// </summary>
        /// <param name="gdprConsent">GDPR consent</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        public virtual async Task DeleteConsentAsync(GdprConsent gdprConsent)
        {
            await _gdprConsentRepository.DeleteAsync(gdprConsent);
        }

        /// <summary>
        /// Gets the latest selected value (a consent is accepted or not by a customer)
        /// </summary>
        /// <param name="consentId">Consent identifier</param>
        /// <param name="customerId">Customer identifier</param>
        /// <returns>
        /// A task that represents the asynchronous operation
        /// The task result contains the result; null if previous a customer hasn't been asked
        /// </returns>
        public async Task<bool?> IsConsentAcceptedAsync(int consentId, int customerId)
        {
            // get latest record
            var log = (await GetAllLogAsync(customerId: customerId, consentId: consentId, pageIndex: 0, pageSize: 1)).FirstOrDefault();
            if (log == null)
            {
                return null;
            }

            return log.RequestType switch
            {
                GdprRequestType.ConsentAgree => true,
                GdprRequestType.ConsentDisagree => false,
                _ => null,
            };
        }

        #endregion

        #region GDPR log
        
        /// <summary>
        /// Get all GDPR log records
        /// </summary>
        /// <param name="customerId">Customer identifier</param>
        /// <param name="consentId">Consent identifier</param>
        /// <param name="customerInfo">Customer info (Exact match)</param>
        /// <param name="requestType">GDPR request type</param>
        /// <param name="pageIndex">Page index</param>
        /// <param name="pageSize">Page size</param>
        /// <returns>
        /// A task that represents the asynchronous operation
        /// The task result contains the gDPR log records
        /// </returns>
        public virtual async Task<IPagedList<GdprLog>> GetAllLogAsync(int customerId = 0, int consentId = 0,
            string customerInfo = "", GdprRequestType? requestType = null,
            int pageIndex = 0, int pageSize = int.MaxValue)
        {
            return await _gdprLogRepository.GetAllPagedAsync(query =>
            {
                if (customerId > 0) 
                    query = query.Where(log => log.CustomerId == customerId);

                if (consentId > 0) 
                    query = query.Where(log => log.ConsentId == consentId);

                if (!string.IsNullOrEmpty(customerInfo)) 
                    query = query.Where(log => log.CustomerInfo == customerInfo);

                if (requestType != null)
                {
                    var requestTypeId = (int)requestType;
                    query = query.Where(log => log.RequestTypeId == requestTypeId);
                }

                query = query.OrderByDescending(log => log.CreatedOnUtc).ThenByDescending(log => log.Id);

                return query;
            }, pageIndex, pageSize);
        }

        /// <summary>
        /// Insert a GDPR log
        /// </summary>
        /// <param name="customer">Customer</param>
        /// <param name="consentId">Consent identifier</param>
        /// <param name="requestType">Request type</param>
        /// <param name="requestDetails">Request details</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        public virtual async Task InsertLogAsync(Customer customer, int consentId, GdprRequestType requestType, string requestDetails)
        {
            if (customer == null)
                throw new ArgumentNullException(nameof(customer));

            var gdprLog = new GdprLog
            {
                CustomerId = customer.Id,
                ConsentId = consentId,
                CustomerInfo = customer.Email,
                RequestType = requestType,
                RequestDetails = requestDetails,
                CreatedOnUtc = DateTime.UtcNow
            };

            await InsertLogAsync(gdprLog);
        }
        
        #endregion

        #region Customer

        /// <summary>
        /// Permanent delete of customer
        /// </summary>
        /// <param name="customer">Customer</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        public async Task PermanentDeleteCustomerAsync(Customer customer)
        {
            if (customer == null)
            {
                throw new ArgumentNullException(nameof(customer));
            }

            // blog comments
            var postComments = await this.postService.GetAllCommentsAsync(customerId: customer.Id);
            await this.postService.DeleteBlogCommentsAsync(postComments);

            //news comments

            ////back in stock subscriptions
            //var backInStockSubscriptions = await _backInStockSubscriptionService.GetAllSubscriptionsByCustomerIdAsync(customer.Id);
            //foreach (var backInStockSubscription in backInStockSubscriptions)
            //    await _backInStockSubscriptionService.DeleteSubscriptionAsync(backInStockSubscription);

            ////product review
            //var productReviews = await _productService.GetAllProductReviewsAsync(customer.Id);
            //var reviewedProducts = await _productService.GetProductsByIdsAsync(productReviews.Select(p => p.ProductId).Distinct().ToArray());
            //await _productService.DeleteProductReviewsAsync(productReviews);
            ////update product totals
            //foreach (var product in reviewedProducts) 
            //    await _productService.UpdateProductReviewTotalsAsync(product);

            // posts
            var posts = await this.postService.GetPostsByUserId(customer.Id);
            await this.postService.DeletePostsAsync(posts);

            //shopping cart items
            //foreach (var sci in await _shoppingCartService.GetShoppingCartAsync(customer))
            //    await _shoppingCartService.DeleteShoppingCartItemAsync(sci);

            // private messages (sent)
            foreach (var pm in await this.chatService.GetAllPrivateMessagesAsync(0, customer.Id, 0, null, null, null, null))
            {
                await this.chatService.DeletePrivateMessageAsync(pm);
            }

            // private messages (received)
            foreach (var pm in await this.chatService.GetAllPrivateMessagesAsync(0, 0, customer.Id, null, null, null, null))
            {
                await this.chatService.DeletePrivateMessageAsync(pm);
            }

            //newsletter

            //addresses

            // generic attributes
            var keyGroup = customer.GetType().Name;
            var genericAttributes = await _genericAttributeService.GetAttributesForEntityAsync(customer.Id, keyGroup);
            await _genericAttributeService.DeleteAttributesAsync(genericAttributes);

            //ignore ActivityLog
            //ignore ForumPost, ForumTopic, ignore ForumPostVote
            //ignore Log
            //ignore PollVotingRecord
            //ignore ProductReviewHelpfulness
            //ignore RecurringPayment 
            //ignore ReturnRequest
            //ignore RewardPointsHistory
            //and we do not delete orders

            // remove from Registered role, add to Guest one
            if (await _customerService.IsRegisteredAsync(customer))
            {
                var registeredRole = await _customerService.GetCustomerRoleBySystemNameAsync(NopCustomerDefaults.RegisteredRoleName);
                await _customerService.RemoveCustomerRoleMappingAsync(customer, registeredRole);
            }

            if (!await _customerService.IsGuestAsync(customer))
            {
                var guestRole = await _customerService.GetCustomerRoleBySystemNameAsync(NopCustomerDefaults.GuestsRoleName);
                await _customerService.AddCustomerRoleMappingAsync(new CustomerCustomerRoleMapping { CustomerId = customer.Id, CustomerRoleId = guestRole.Id });
            }

            var email = customer.Email;

            // clear other information
            customer.Email = string.Empty;
            customer.EmailToRevalidate = string.Empty;
            customer.DisplayName = string.Empty;            // Username
            customer.Active = false;
            customer.Deleted = true;
            
            await _customerService.UpdateCustomerAsync(customer);

            // raise event
            await _eventPublisher.PublishAsync(new CustomerPermanentlyDeleted(customer.Id, email));
        }

        #endregion

        #endregion
    }
}