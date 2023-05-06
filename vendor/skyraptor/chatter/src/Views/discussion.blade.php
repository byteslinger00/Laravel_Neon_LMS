@extends(config('chatter.master_file_extend'))

@section('content')
<section class="discussion-header">
	<div class="container">
		<div class="row">
			<div class="col-12 d-none d-md-flex flex-column flex-md-row align-items-center pt-3 pb-3">
				<a class="btn btn-secondary p-2 rounded-circle mr-3 lh-normal" href="/{{ config('chatter.routes.home') }}"><i class="fas fa-chevron-left d-flex align-items-center"></i></a>
				<h1 class="mb-0 flex-grow-1 text-primary">{{ $discussion->title }}</h1>
				<span class="text-softwhite">@lang('chatter::messages.discussion.head_details')<a class="badge p-2 text-white ml-2" href="/{{ config('chatter.routes.home') }}/{{ config('chatter.routes.category') }}/{{ $discussion->category->slug }}" style="background-color:{{ $discussion->category->color }}">{{ $discussion->category->name }}</a></span>
			</div>
			<div class="col-12 d-flex d-md-none flex-column flex-md-row align-items-center pt-3 pb-3">
				<div class="d-flex d-flex-row align-items-center">
					<a class="btn btn-secondary p-2 rounded-circle mr-3 lh-normal" href="/{{ config('chatter.routes.home') }}"><i class="fas fa-chevron-left d-flex align-items-center"></i></a>
					<span class="text-softwhite">@lang('chatter::messages.discussion.head_details')<a class="badge p-2 text-white ml-2" href="/{{ config('chatter.routes.home') }}/{{ config('chatter.routes.category') }}/{{ $discussion->category->slug }}" style="background-color:{{ $discussion->category->color }}">{{ $discussion->category->name }}</a></span>
				</div>
				<h1 class="mb-0 flex-grow-1 text-primary">{{ $discussion->title }}</h1>
			</div>
		</div>
	</div>
</section>

@if(config('chatter.errors'))
<section class="alerts">
	@if(Session::has('chatter_alert'))
	<div class="chatter-alert alert alert-dismissible alert-{{ Session::get('chatter_alert_type') }} rounded-0 font-weight-bold" role="alert">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<strong><i class="chatter-alert-{{ Session::get('chatter_alert_type') }}"></i> {{ config('chatter.alert_messages.' . Session::get('chatter_alert_type')) }}</strong>
					{{ Session::get('chatter_alert') }}
				</div>
			</div>
		</div>
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<i class="chatter-close fas fa-times-circle"></i>
		</button>
	</div>
	@endif

	@if (count($errors) > 0)
	<div class="chatter-alert alert alert-dismissible alert-danger rounded-0 font-weight-bold" role="alert">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<p><strong><i class="chatter-alert-danger"></i> @lang('chatter::alert.danger.title')</strong> @lang('chatter::alert.danger.reason.errors')</p>
					<ul>
						@foreach ($errors->all() as $error)
						<li>{{ $error }}</li>
						@endforeach
					</ul>
				</div>
			</div>
		</div>
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<i class="chatter-close fas fa-times-circle"></i>
		</button>
	</div>
	@endif
</section>
@endif

<section class="bg-darker forum pt-5 pb-5">
	<div class="container">
		<div class="row">
			<div class="col posts">
			@foreach($posts as $post)
			<div class="row post mb-3" data-id="{{ $post->id }}">
				<!-- Left -->
				<div class="left col-12 col-sm-2 py-3">
					<div class="avatar">
						@if(config('chatter.user.avatar_image_database_field'))
							<!-- If the user db field contains http:// or https:// we don't need to use the relative path to the image assets -->
							@if( (substr($post->user->getAttribute(config('chatter.user.avatar_image_database_field')), 0, 7) == 'http://') || (substr($post->user->getAttribute(config('chatter.user.avatar_image_database_field')), 0, 8) == 'https://') )
							<img src="{{ $post->user->getAttribute(config('chatter.user.avatar_image_database_field'))  }}" class="img-fluid d-block mx-auto rounded">
							@else
							<img src="{{ config('chatter.user.relative_url_to_image_assets') . $post->user->getAttribute(config('chatter.user.avatar_image_database_field'))  }}" class="img-fluid d-block mx-auto rounded">
							@endif
						@else
							<p class="text-center lead">
								<span class="p-2 chatter_avatar_circle" style="background-color:#{{ \SkyRaptor\Chatter\Helpers\ChatterHelper::stringToColorCode($post->user->getAttribute(config('chatter.user.database_field_with_user_name'))) }}">
									{{ strtoupper(substr($post->user->getAttribute(config('chatter.user.database_field_with_user_name')), 0, 1)) }}
								</span>
							</p>
						@endif
					</div>
				</div>
				<!-- Left -->
				<!-- Right -->
				<div class="right col-12 col-sm-10 py-3">
					<div class="d-flex flex-column flex-grow-1 h-100">
						<!-- Post Details -->
						<div class="details text-center text-sm-left text-softwhite mb-2">
							<a class="lead" href="{{ \SkyRaptor\Chatter\Helpers\ChatterHelper::userLink($post->user) }}">{{ ucfirst($post->user->{config('chatter.user.database_field_with_user_name')}) }}</a> <span class="ago">{{ \Carbon\Carbon::createFromTimeStamp(strtotime($post->created_at))->diffForHumans() }}</span>
						</div>

						<!-- Content -->
						<div class="content d-flex flex-column flex-grow-1">
							<!-- Post Content -->
							<div class="main text-white">
								<div class="body text-break">
									{!! $post->body !!}
								</div>
							</div>
						</div>
						<!-- /Content -->

						<!-- Actions -->
						<div class="actions pt-2 d-flex align-items-center justify-content-end">
							@if(!Auth::guest() && (Auth::user()->id == $post->user->id))
							<!-- Default Post actions -->
							<div class="chatter_post_actions">
								<button class="btn btn-secondary chatter_edit_btn">
									<i class="fas fa-edit"></i> @lang('chatter::messages.words.edit')
								</button>
								<button class="btn btn-danger chatter_delete_btn" data-toggle="modal" data-target="#modal-delete-post-{{ $post->id }}">
									<i class="fas fa-trash-alt"></i> @lang('chatter::messages.words.delete')
								</button>

								<form class="post-edit-form d-none" action="/{{ config('chatter.routes.home') . '/posts/' . $post->id}}" method="POST">
									@method('PATCH')
									@csrf
									<input type="hidden" name="body">
								</form>

								<form class="post-delete-form d-none" action="/{{ config('chatter.routes.home') . '/posts/' . $post->id }}" method="POST">
									@method('DELETE')
									@csrf
								</form>

								<div class="modal fade" id="modal-delete-post-{{ $post->id }}" tabindex="-1" role="dialog" aria-labelledby="modal-delete-post-{{ $post->id }}-label" aria-hidden="true">
									<div class="modal-dialog" role="document">
										<div class="modal-content">
											<div class="modal-header">
												<h5 class="modal-title" id="modal-delete-post-{{ $post->id }}-label">@lang('chatter::messages.response.confirm')</h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div class="modal-body">
												...
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal">@lang('chatter::messages.response.no_confirm')</button>
												<button type="button" class="btn btn-primary btn-delete-post" post-id="{{ $post->id }}">@lang('chatter::messages.response.yes_confirm')</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Editing actions -->
							<div class="chatter_update_actions d-none">
								<button class="btn btn-secondary cancel_chatter_edit">@lang('chatter::messages.words.cancel')</button>
								<button class="btn btn-success update_chatter_edit"><i class="fas fa-check"></i>@lang('chatter::messages.response.update')</button>
							</div>
							@endif
						</div>
						<!-- /Actions -->
					</div>
				</div>
				<!-- /Right -->
			</div>
			@endforeach
			</div>
		</div>
		
		<div class="row">
			<div class="col-12">

				<div class="conversation">
					<ul class="posts pl-0">
						
					</ul>
				</div>

				<!-- Pagination -->
				{{ $posts->links() }}
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<hr class="mt-5 mb-5"/>
				@auth
				<h2 class="mb-4">@lang('forum.newResponse')</h2>
				<div id="new_response">
					<div id="new_discussion">
						<div class="chatter_loader dark" id="new_discussion_loader">
							<div></div>
						</div>

						<form id="chatter_form_editor" action="/{{ config('chatter.routes.home') }}/posts" method="POST">

							<!-- BODY -->
							<div id="editor">
								<label id="tinymce_placeholder" class="d-none">@lang('chatter::messages.editor.tinymce_placeholder')</label>
								<textarea id="body" class="richText" name="body" placeholder="">{{ old('body') }}</textarea>
							</div>

							<input type="hidden" name="_token" id="csrf_token_field" value="{{ csrf_token() }}">
							<input type="hidden" name="chatter_discussion_id" value="{{ $discussion->id }}">
						</form>

					</div><!-- #new_response -->
					<div id="discussion_response_email" class="p-2 bg-white">
						<button id="submit_response" class="btn btn-success float-right"><i class="fas fa-plus-circle"></i> @lang('chatter::messages.response.submit')</button>
						<div class="clearfix"></div>
					</div>
				</div>
				@endauth

				@guest
				<div id="login_or_register" class="text-white text-center">
					<p>
						@lang('forum.messages.auth', ['login' => route('login.steam')])
					</p>
				</div>
				@endguest
			</div>
		</div>
	</div>
</section>

<input type="hidden" id="chatter_tinymce_toolbar" value="{{ config('chatter.tinymce.toolbar') }}">
<input type="hidden" id="chatter_tinymce_plugins" value="{{ config('chatter.tinymce.plugins') }}">
<input type="hidden" id="current_path" value="{{ Request::path() }}">
@endsection

@section(config('chatter.yields.header'))
<link href="{{ url('/vendor/skyraptor/chatter/assets/css/chatter.css') }}" rel="stylesheet">
@endsection

@section(config('chatter.yields.footer'))
<script src="{{ url('/vendor/skyraptor/chatter/assets/js/chatter-discussion.js') }}"></script>
@endsection