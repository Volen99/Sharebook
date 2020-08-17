// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: Proto/science.proto
// </auto-generated>
#pragma warning disable 0414, 1591
#region Designer generated code

using grpc = global::Grpc.Core;

namespace GrpcScience {
  public static partial class Science
  {
    static readonly string __ServiceName = "ScienceApi.Science";

    static readonly grpc::Marshaller<global::GrpcScience.MediaRequest> __Marshaller_ScienceApi_MediaRequest = grpc::Marshallers.Create((arg) => global::Google.Protobuf.MessageExtensions.ToByteArray(arg), global::GrpcScience.MediaRequest.Parser.ParseFrom);
    static readonly grpc::Marshaller<global::GrpcScience.MediaResponse> __Marshaller_ScienceApi_MediaResponse = grpc::Marshallers.Create((arg) => global::Google.Protobuf.MessageExtensions.ToByteArray(arg), global::GrpcScience.MediaResponse.Parser.ParseFrom);
    static readonly grpc::Marshaller<global::GrpcScience.MediasRequest> __Marshaller_ScienceApi_MediasRequest = grpc::Marshallers.Create((arg) => global::Google.Protobuf.MessageExtensions.ToByteArray(arg), global::GrpcScience.MediasRequest.Parser.ParseFrom);
    static readonly grpc::Marshaller<global::GrpcScience.PaginatedItemsResponse> __Marshaller_ScienceApi_PaginatedItemsResponse = grpc::Marshallers.Create((arg) => global::Google.Protobuf.MessageExtensions.ToByteArray(arg), global::GrpcScience.PaginatedItemsResponse.Parser.ParseFrom);

    static readonly grpc::Method<global::GrpcScience.MediaRequest, global::GrpcScience.MediaResponse> __Method_GetMediaById = new grpc::Method<global::GrpcScience.MediaRequest, global::GrpcScience.MediaResponse>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetMediaById",
        __Marshaller_ScienceApi_MediaRequest,
        __Marshaller_ScienceApi_MediaResponse);

    static readonly grpc::Method<global::GrpcScience.MediasRequest, global::GrpcScience.PaginatedItemsResponse> __Method_GetMediasByIds = new grpc::Method<global::GrpcScience.MediasRequest, global::GrpcScience.PaginatedItemsResponse>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetMediasByIds",
        __Marshaller_ScienceApi_MediasRequest,
        __Marshaller_ScienceApi_PaginatedItemsResponse);

    /// <summary>Service descriptor</summary>
    public static global::Google.Protobuf.Reflection.ServiceDescriptor Descriptor
    {
      get { return global::GrpcScience.ScienceReflection.Descriptor.Services[0]; }
    }

    /// <summary>Base class for server-side implementations of Science</summary>
    [grpc::BindServiceMethod(typeof(Science), "BindService")]
    public abstract partial class ScienceBase
    {
      /// <summary>
      /// >>
      ///option (google.api.http) = {
      ///get: "/api/v1/catalog/items/{id}"
      ///};
      ///&lt;&lt; 
      /// </summary>
      /// <param name="request">The request received from the client.</param>
      /// <param name="context">The context of the server-side call handler being invoked.</param>
      /// <returns>The response to send back to the client (wrapped by a task).</returns>
      public virtual global::System.Threading.Tasks.Task<global::GrpcScience.MediaResponse> GetMediaById(global::GrpcScience.MediaRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

      public virtual global::System.Threading.Tasks.Task<global::GrpcScience.PaginatedItemsResponse> GetMediasByIds(global::GrpcScience.MediasRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

    }

    /// <summary>Creates service definition that can be registered with a server</summary>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    public static grpc::ServerServiceDefinition BindService(ScienceBase serviceImpl)
    {
      return grpc::ServerServiceDefinition.CreateBuilder()
          .AddMethod(__Method_GetMediaById, serviceImpl.GetMediaById)
          .AddMethod(__Method_GetMediasByIds, serviceImpl.GetMediasByIds).Build();
    }

    /// <summary>Register service method with a service binder with or without implementation. Useful when customizing the  service binding logic.
    /// Note: this method is part of an experimental API that can change or be removed without any prior notice.</summary>
    /// <param name="serviceBinder">Service methods will be bound by calling <c>AddMethod</c> on this object.</param>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    public static void BindService(grpc::ServiceBinderBase serviceBinder, ScienceBase serviceImpl)
    {
      serviceBinder.AddMethod(__Method_GetMediaById, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::GrpcScience.MediaRequest, global::GrpcScience.MediaResponse>(serviceImpl.GetMediaById));
      serviceBinder.AddMethod(__Method_GetMediasByIds, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::GrpcScience.MediasRequest, global::GrpcScience.PaginatedItemsResponse>(serviceImpl.GetMediasByIds));
    }

  }
}
#endregion
